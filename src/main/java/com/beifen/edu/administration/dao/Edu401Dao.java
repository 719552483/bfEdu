package com.beifen.edu.administration.dao;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.beifen.edu.administration.domian.Edu401;

@Configuration
public interface Edu401Dao extends JpaRepository<Edu401, Long>, JpaSpecificationExecutor<Edu401> {

	// 查询默认课节设置
	@Query(value = "select * from edu401 e where e.xnid  is NULL", nativeQuery = true)
	List<Edu401> queryDefaultkjsz();

	// 根据学年 时间段查询课节
	@Query(value = "select * from edu401 e where e.xnid=?1 and e.sjd=?2", nativeQuery = true)
	List<Edu401> findKjPonitXnAndSjd(String xnID, String sjd);

	@Query(value = "select * from edu401 e where e.sjd=?1", nativeQuery = true)
	List<Edu401> findKjPonitSjd(String sjd);

	// 根据id删除课节
	@Transactional
	@Modifying
	@Query(value = "delete from edu401 where Edu401_ID =?1", nativeQuery = true)
	void removeTasks(String deleteId);

	// 根据id查询课节
	@Query(value = "select * from edu401 e where e.Edu401_ID=?1", nativeQuery = true)
	Edu401 queryKjById(String kjId);

	// 课节顺序减一
	@Transactional
	@Modifying
	@Query(value = "UPDATE edu401 SET kjsx =?2 WHERE Edu401_ID =?1", nativeQuery = true)
	void kjsxjy(String kjId, String kjsx);

}
