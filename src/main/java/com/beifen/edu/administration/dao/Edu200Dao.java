package com.beifen.edu.administration.dao;

import java.util.List;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.beifen.edu.administration.domian.Edu200;

@Configuration
public interface Edu200Dao extends JpaRepository<Edu200, Long>, JpaSpecificationExecutor<Edu200> {
	// 根据代码查询课程
	@Query(value = "select * from edu200 e where e.zt='pass'", nativeQuery = true)
	public List<Edu200> queryAllPassCrouse();

	// 根据id修改课程状态
	@Modifying
	@Transactional
	@Query(value = "UPDATE edu200 SET zt =?2,shr=?3,shrID =?4,shsj=?5 WHERE bf200_ID =?1", nativeQuery = true)
	public void modifyClassById(String id, String status, String approvalPerson, long approvalPersonId,
			long approvalTime);

	// 根据id删除课程
	@Transactional
	@Modifying
	@Query(value = "delete from edu200 where bf200_ID =?1", nativeQuery = true)
	void removeLibraryClassById(String id);

	// 根据id码查询课程
	@Query(value = "select * from edu200 e where e.bf200_ID=?1", nativeQuery = true)
	public Edu200 queryClassById(String edu200id);

	//审批结束回写课程状态
	@Query(value = "update edu200 e set zx = ?2 where e.bf200_ID=?1", nativeQuery = true)
	void updateState(String businessKey, String passing);
}
