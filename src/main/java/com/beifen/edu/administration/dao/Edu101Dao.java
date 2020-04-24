package com.beifen.edu.administration.dao;



import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import com.beifen.edu.administration.domian.Edu101;

@Configuration
public interface Edu101Dao extends JpaRepository<Edu101, Long>, JpaSpecificationExecutor<Edu101> {
	// 根据id查询教师姓名
	@Query(value = "select b.jsxm from edu101 b where b.Edu101_ID=?1", nativeQuery = true)
	public String queryTeacherById(Long techerId);
	
	
}
